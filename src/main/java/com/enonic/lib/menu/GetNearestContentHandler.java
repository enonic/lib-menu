package com.enonic.lib.menu;

import java.util.function.Supplier;

import com.enonic.xp.content.Content;
import com.enonic.xp.content.ContentPath;
import com.enonic.xp.content.ContentService;
import com.enonic.xp.lib.content.mapper.ContentMapper;
import com.enonic.xp.portal.PortalRequest;
import com.enonic.xp.script.bean.BeanContext;
import com.enonic.xp.script.bean.ScriptBean;

public class GetNearestContentHandler
    implements ScriptBean
{
    private Supplier<PortalRequest> requestSupplier;

    private Supplier<ContentService> contentServiceSupplier;

    @Override
    public void initialize( final BeanContext context )
    {
        this.requestSupplier = context.getBinding( PortalRequest.class );
        this.contentServiceSupplier = context.getService( ContentService.class );
    }

    public ContentMapper execute()
    {
        final ContentPath contentPath = requestSupplier.get().getContentPath();
        if ( contentServiceSupplier.get().contentExists( contentPath ) )
        {
            return new ContentMapper( contentServiceSupplier.get().getByPath( contentPath ) );
        }

        Content content = null;
        ContentPath nextContentPath = ContentPath.ROOT;
        for ( int index = 0; index < contentPath.elementCount(); index++ )
        {
            final ContentPath currentContentPath = ContentPath.from( nextContentPath, contentPath.getElement( index ) );
            if ( contentServiceSupplier.get().contentExists( currentContentPath ) )
            {
                content = contentServiceSupplier.get().getByPath( currentContentPath );
                nextContentPath = currentContentPath;
            }
            else
            {
                break;
            }
        }
        return content != null ? new ContentMapper( content ) : null;
    }
}
